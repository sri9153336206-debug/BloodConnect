import { useEffect }        from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { useUI } from '../context/UIContext.jsx'
import { DrawerModal } from '../components/ui/Modal.jsx'
import FilterPanel   from '../components/features/FilterPanel.jsx'

// ════════════════════════════════════════════════════
//  SCROLL TO TOP ON ROUTE CHANGE
// ════════════════════════════════════════════════════
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

// ════════════════════════════════════════════════════
//  PAGE WRAPPER — adds fade-in animation per route
// ════════════════════════════════════════════════════
const PageWrapper = ({ children }) => {
  const { pathname } = useLocation()

  return (
    <div
      key={pathname}
      className="animate-fade-in min-h-screen"
    >
      {children}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  PAGES WITHOUT FOOTER
// ════════════════════════════════════════════════════
const NO_FOOTER_PAGES = [
  '/login',
  '/signup',
]

// ════════════════════════════════════════════════════
//  PAGES WITHOUT NAVBAR
// ════════════════════════════════════════════════════
const NO_NAVBAR_PAGES = []

// ════════════════════════════════════════════════════
//  MAIN LAYOUT COMPONENT
// ════════════════════════════════════════════════════
const MainLayout = () => {

  const { pathname } = useLocation()
  const {
    isFilterDrawerOpen,
    closeFilterDrawer,
  } = useUI()

  // ── Should Show Footer / Navbar ───────────────────
  const showFooter = !NO_FOOTER_PAGES.includes(pathname)
  const showNavbar = !NO_NAVBAR_PAGES.includes(pathname)

  // ── Render ───────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── Scroll To Top ──────────────────────── */}
      <ScrollToTop />

      {/* ── Navbar ─────────────────────────────── */}
      {showNavbar && <Navbar />}

      {/* ── Main Content ───────────────────────── */}
      <main
        className="flex-1"
        id="main-content"
        role="main"
      >
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>

      {/* ── Footer ─────────────────────────────── */}
      {showFooter && <Footer />}

      {/* ── Mobile Filter Drawer ───────────────── */}
      {/* shown when user taps filter icon
          on FindDonorPage on mobile */}
      <DrawerModal
        isOpen={isFilterDrawerOpen}
        onClose={closeFilterDrawer}
        title="Filter Donors"
        size="lg"
      >
        <div className="p-4">
          <FilterPanel
            showHeader={false}
            compact
            onApply={closeFilterDrawer}
          />
        </div>
      </DrawerModal>

    </div>
  )
}

export default MainLayout