import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { Link, useLocation } from "react-router-dom"

interface NavLink {
  to: string
  label: string
  children?: { to: string; label: string }[]
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks: NavLink[] = [
    {
      to: "/services",
      label: "Услуги",
      children: [
        { to: "/services", label: "Строительный контроль" },
        { to: "/geodesy", label: "Геодезическое обеспечение" },
        { to: "/laboratory", label: "Строительная лаборатория" },
        { to: "/print-order", label: "3D печать" },
        { to: "/scan-order", label: "Сканирование" },
      ],
    },
    {
      to: "/equipment",
      label: "Оборудование",
      children: [
        { to: "/certificates", label: "Сертификаты" },
      ],
    },
    { to: "/contacts", label: "Контакты" },
  ]

  const isActive = (link: NavLink) =>
    location.pathname === link.to || (link.children?.some((c) => c.to === location.pathname) ?? false)

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled ? "bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#7A7FEE]/50 px-4 py-2 md:px-5 shadow-[0_0_18px_rgba(122,127,238,0.18)]">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="https://cdn.poehali.dev/projects/f76cda14-7429-4cfa-98c1-c5a650df2ebc/bucket/favicon-nobg.png"
                alt="Логотип ЦСИ"
                className="h-9 w-9 object-contain"
              />
              <span className="text-lg md:text-xl font-bold text-black dark:text-white leading-tight whitespace-nowrap">
                Центр <span className="text-[#7A7FEE]">Строительного</span> Инжиниринга
              </span>
            </Link>

            <div className="flex items-center space-x-2 md:space-x-4">
              <nav className="hidden md:block">
                <ul className="flex space-x-1">
                  {navLinks.map((link) => (
                    <li
                      key={link.to}
                      className="relative"
                      onMouseEnter={() => link.children && setOpenDropdown(link.to)}
                      onMouseLeave={() => link.children && setOpenDropdown(null)}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive(link)
                            ? "bg-[#7A7FEE] text-white"
                            : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {link.label}
                        {link.children && <ChevronDown className="h-3.5 w-3.5" />}
                      </Link>

                      {link.children && (
                        <div
                          className={`absolute left-0 top-full pt-2 transition-all duration-150 ${
                            openDropdown === link.to
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-1"
                          }`}
                        >
                          <div className="nav-dropdown-content !p-2 flex flex-col gap-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-black dark:text-white hover:bg-[#7A7FEE] hover:text-white"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <ThemeToggle />

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md bg-transparent hover:bg-gray-200/50 dark:hover:bg-gray-800/20 md:hidden"
                aria-label="Меню"
              >
                <Menu className="h-6 w-6 text-black dark:text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 md:hidden">
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-[#111111] shadow-xl overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
              <img
                src="https://cdn.poehali.dev/projects/f76cda14-7429-4cfa-98c1-c5a650df2ebc/bucket/favicon-nobg.png"
                alt="Логотип ЦСИ"
                className="h-8 w-8 object-contain"
              />
              <span className="text-base font-bold text-black dark:text-white leading-tight">
                Центр <span className="text-[#7A7FEE]">Строительного</span> Инжиниринга
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Закрыть меню"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    className="flex items-center py-3 px-4 rounded-lg text-base text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Главная
                  </Link>
                </li>
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <div className="flex items-center">
                      <Link
                        to={link.to}
                        className={`flex-1 flex items-center py-3 px-4 rounded-lg text-base hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          isActive(link)
                            ? "text-[#7A7FEE] font-medium"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <button
                          onClick={() =>
                            setMobileExpanded(mobileExpanded === link.to ? null : link.to)
                          }
                          className="p-3 text-gray-500 dark:text-gray-400"
                          aria-label="Развернуть подменю"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              mobileExpanded === link.to ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    {link.children && mobileExpanded === link.to && (
                      <ul className="pl-4 space-y-1 mb-1">
                        {link.children.map((child) => (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              className={`flex items-center py-2.5 px-4 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                location.pathname === child.to
                                  ? "text-[#7A7FEE] font-medium"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}