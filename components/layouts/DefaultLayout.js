import { Book, BookMarked, History, Home, Play, Sun, ArrowUp, SearchIcon } from "lucide-react"
import {
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useSwipeable } from 'react-swipeable'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import UserDropdown from "./UserDropdown"

const menuItems = [
  { title: "Home", url: "/home", icon: Home },
]

const mangaItems = [
  { title: "Latest", url: "/latest", icon: Book },
  { title: "Library", url: "/library", icon: BookMarked },
  { title: "History", url: "/history", icon: History },
]

const animeItems = [
  { title: "Latest", url: "/anime/latest", icon: Play },
  { title: "Season", url: "/anime/season", icon: Sun },
  { title: "History", url: "/anime/history", icon: History },
]

export function DefaultLayout({ children }) {
  const pathname = usePathname()

  const {
    setOpen,
    setOpenMobile,
    isMobile,
  } = useSidebar()
  const [shouldStick, setShouldStick] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    if (pathname && (pathname.includes("/watch/") || pathname.includes("/read/"))) {
      setShouldStick(false)
    } else {
      setShouldStick(true)
    }
  }, [pathname, isMobile])

  useEffect(() => {
    const handleScroll = () => {
      // Only show scroll to top button when shouldStick is false and scrolled > 300px
      if (!shouldStick && window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldStick])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  var swipeConfig = {
    delta: { right: 20 },
    swipeDuration: 250,
  }
  const handlers = useSwipeable({
    onSwipedRight: () => {
      setOpen(true)
      setOpenMobile(true)
    },
    ...swipeConfig,
  });

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <a href="/">
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img src="/images/cover192.png" className="rounded-lg" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Animapu
                    </span>
                    <span className="truncate text-xs">from weebs to weebs</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </a>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url == pathname}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Manga</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mangaItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url == pathname}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Anime</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {animeItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url == pathname}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header
          className={`
            ${shouldStick ? "sticky top-0 z-30" : ""}
            flex flex-row items-center justify-between p-1 bg-background/80 border-b border-accent backdrop-blur-2xl
          `}
        >
          <div className="flex flex-row items-center">
            <SidebarTrigger />
            <div className="ml-2 border-l border-accent h-10" />
            <a href="/" className="mx-4">
              <div className="flex flex-row items-center gap-2">
                <div className="flex aspect-square size-6 items-center justify-center rounded-lg">
                  <img src="/images/cover192.png" className="rounded-lg" />
                </div>
                <div>
                  Animapu
                </div>
              </div>
            </a>
            <div className="ml-2 border-l border-accent h-10" />
            <Link href="/search"
              className="size-10 flex items-center justify-center hover:bg-accent rounded cursor-pointer">
              <SearchIcon size={20} />
            </Link>
          </div>
          <div className="flex flex-row items-center">
            <div className="size-10 flex items-center justify-center hover:bg-accent rounded cursor-pointer">
              <UserDropdown />
            </div>
          </div>
        </header>

        <div
          className={`mx-auto w-full ${pathname && pathname.includes("/watch/") ? "" : "max-w-[768px]"}`}
          {...handlers}
        >
          {children}
        </div>

        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          className={`
            fixed bottom-6 left-6 z-50 rounded-full w-12 h-12 p-0 shadow-lg
            transition-all duration-300 ease-in-out
            ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}
          `}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </SidebarInset>
    </>
  )
}
