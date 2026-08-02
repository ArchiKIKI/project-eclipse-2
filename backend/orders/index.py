"""
Приём заявок на 3D-печать деталей и выезд на 3D-сканирование.
Сохраняет заявку в БД, загружает файл модели в S3 (если есть) и отправляет уведомления на email и в Telegram.
"""
import json
import os
import base64
import uuid
import smtplib
import urllib.request
import urllib.parse
from email.mime.text import MIMEText
from email.header import Header
import psycopg2
import boto3

SMTP_LOGIN_EMAIL = "csiperm@yandex.ru"
NOTIFY_EMAIL = "Maratam.zag@yandex.ru"
NOTIFY_TELEGRAM = "@Testusers21231"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def upload_file_to_s3(file_base64: str, file_name: str) -> str:
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    ext = file_name.split(".")[-1] if "." in file_name else "stl"
    key = f"orders/{uuid.uuid4()}.{ext}"
    data = base64.b64decode(file_base64)
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType="application/octet-stream")
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def send_telegram(text: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": chat_id, "text": text, "parse_mode": "HTML"}).encode()
    req = urllib.request.Request(url, data=data)
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass


def send_email(subject: str, body: str) -> None:
    password = os.environ.get("YANDEX_SMTP_PASSWORD")
    if not password:
        return
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = Header(subject, "utf-8")
    msg["From"] = SMTP_LOGIN_EMAIL
    msg["To"] = NOTIFY_EMAIL
    try:
        with smtplib.SMTP_SSL("smtp.yandex.ru", 465, timeout=10) as server:
            server.login(SMTP_LOGIN_EMAIL, password)
            server.sendmail(SMTP_LOGIN_EMAIL, [NOTIFY_EMAIL], msg.as_string())
    except Exception:
        pass


def handler(event: dict, context) -> dict:
    """Принимает заявки на 3D-печать (order_type=print) и выезд на сканирование (order_type=scan)."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
        "Access-Control-Max-Age": "86400",
    }

    method = event.get("httpMethod")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, phone, email, file_url, file_name, material, color, quantity, comment, status, created_at "
            "FROM print_orders ORDER BY created_at DESC LIMIT 100"
        )
        print_rows = cur.fetchall()
        cur.execute(
            "SELECT id, name, phone, email, address, preferred_date, comment, status, created_at "
            "FROM scan_orders ORDER BY created_at DESC LIMIT 100"
        )
        scan_rows = cur.fetchall()
        cur.close()
        conn.close()

        print_orders = [
            {
                "id": r[0], "name": r[1], "phone": r[2], "email": r[3], "file_url": r[4],
                "file_name": r[5], "material": r[6], "color": r[7], "quantity": r[8],
                "comment": r[9], "status": r[10], "created_at": r[11].isoformat(),
            }
            for r in print_rows
        ]
        scan_orders = [
            {
                "id": r[0], "name": r[1], "phone": r[2], "email": r[3], "address": r[4],
                "preferred_date": r[5], "comment": r[6], "status": r[7], "created_at": r[8].isoformat(),
            }
            for r in scan_rows
        ]
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"print_orders": print_orders, "scan_orders": scan_orders}),
        }

    if method != "POST":
        return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    order_type = body.get("order_type")

    name = (body.get("name") or "").strip()
    phone = (body.get("phone") or "").strip()
    email = (body.get("email") or "").strip()

    if not name or not phone:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажите имя и телефон"})}

    conn = get_conn()
    cur = conn.cursor()

    if order_type == "print":
        file_url = None
        file_name = body.get("file_name") or ""
        file_base64 = body.get("file_base64")
        if file_base64 and file_name:
            file_url = upload_file_to_s3(file_base64, file_name)

        material = body.get("material") or ""
        color = body.get("color") or ""
        quantity = int(body.get("quantity") or 1)
        comment = body.get("comment") or ""

        cur.execute(
            "INSERT INTO print_orders (name, phone, email, file_url, file_name, material, color, quantity, comment) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (name, phone, email, file_url, file_name, material, color, quantity, comment),
        )
        order_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        notify_text = (
            f"🖨 Новая заявка на 3D-печать #{order_id}\n"
            f"Имя: {name}\nТелефон: {phone}\nEmail: {email}\n"
            f"Материал: {material}\nЦвет: {color}\nКоличество: {quantity}\n"
            f"Файл: {file_url or 'не приложен'}\nКомментарий: {comment}"
        )
        send_telegram(notify_text)
        send_email(f"Новая заявка на 3D-печать #{order_id}", notify_text)

        return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True, "id": order_id})}

    if order_type == "scan":
        address = (body.get("address") or "").strip()
        preferred_date = body.get("preferred_date") or ""
        comment = body.get("comment") or ""

        if not address:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажите адрес выезда"})}

        cur.execute(
            "INSERT INTO scan_orders (name, phone, email, address, preferred_date, comment) "
            "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (name, phone, email, address, preferred_date, comment),
        )
        order_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        notify_text = (
            f"📡 Новая заявка на выезд 3D-сканирования #{order_id}\n"
            f"Имя: {name}\nТелефон: {phone}\nEmail: {email}\n"
            f"Адрес: {address}\nЖелаемая дата: {preferred_date}\nКомментарий: {comment}"
        )
        send_telegram(notify_text)
        send_email(f"Новая заявка на выезд сканирования #{order_id}", notify_text)

        return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True, "id": order_id})}

    cur.close()
    conn.close()
    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Неизвестный тип заявки"})}