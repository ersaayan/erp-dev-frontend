"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StockList from "@/components/StockList/StockList";
import StockForm from "@/components/StockForm/StockForm";
import StockMovements from "@/components/StockMovements";
import TabContainer from "@/components/TabContainer";
import { Button } from "@/components/ui/button";
import { Menu, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ExchangeRateDisplay from "@/components/ExchangeRateDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ServicesCosts from "@/components/Services-Costs";
import StockVouchers from "@/components/StockVouchers";
import BundleSetStocks from "@/components/BundleSetStocks";
import BundleSetStockForm from "@/components/BundleSetStockForm";
import QuickStock from "@/components/QuickStock";
import Campaigns from "@/components/Campaigns";
import CampaignDialog from "@/components/Campaigns/CampaignDialog";
import Categories from "@/components/Categories";
import Properties from "@/components/Properties";
import { ToastProvider } from "@/components/ui/toast";
import CurrentList from "@/components/CurrentList";
import CurrentCategories from "@/components/CurrentCategories";
import AccountSummary from "@/components/AccountSummary";
import Warehouses from "@/components/Warehouses";
import InvoiceListPage from "@/components/InvoiceList";
import QuickSales from "@/components/QuickSales";
import VaultOperations from "@/components/VaultOperations";
import BankOperations from "@/components/BankOperations";
import PosOperations from "@/components/PosOperations";
import CurrentTransactions from "@/components/CurrentTransactions";
import ApiDocumentation from "@/components/Settings/ApiDocumentation";
import UsersPage from "@/components/users";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuthService } from "@/lib/services/auth";
import { decodeJWT } from "@/lib/utils/jwt";
import PurchaseInvoice from "@/components/PurchaseInvoice";
import SalesInvoice from "@/components/SalesInvoice";
import OrderPreparation from "@/components/OrderPreparation";
import CurrentForm from "@/components/CurrentForm";
import BarcodeGenerator from "@/components/BarcodeGenerator";

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useAuthService();
  const [username, setUsername] = useState<string>("User");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Yeni bir bildirim var" },
    { id: 2, message: "Önemli güncelleme mevcut" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.username) {
        setUsername(decoded.username);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMenuItemClick = (itemName: string) => {
    if (!openTabs.includes(itemName)) {
      setOpenTabs([...openTabs, itemName]);
    }
    setActiveTab(itemName);
  };

  const handleCloseTab = (tabName: string) => {
    const newOpenTabs = openTabs.filter((tab) => tab !== tabName);
    setOpenTabs(newOpenTabs);
    if (activeTab === tabName) {
      setActiveTab(newOpenTabs[newOpenTabs.length - 1] || null);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      toast({
        title: "Başarılı",
        description: "Çıkış yapıldı",
      });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu",
      });
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-sidebar-bg">
        <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onMenuItemClick={handleMenuItemClick}
          />
        </div>

        <div className="main-content">
          <header className="bg-sidebar-bg text-sidebar-text p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-2 text-sidebar-text hover:bg-sidebar-hover"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <ExchangeRateDisplay />
              <ThemeToggle />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-text hover:bg-sidebar-hover relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Bildirimler</h4>
                      <p className="text-sm text-muted-foreground">
                        Son bildirimleriniz burada görüntülenir.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-center space-x-2"
                        >
                          <Bell className="h-4 w-4" />
                          <span className="text-sm">
                            {notification.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sidebar-text hover:bg-sidebar-hover border border-sidebar-text"
                    >
                      <span className="mr-2">{username}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="overflow-auto bg-background p-4">
            <TabContainer
              tabs={openTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCloseTab={handleCloseTab}
              sidebarCollapsed={isSidebarCollapsed}
            >
              {activeTab === "Stok Listesi" && (
                <StockList onMenuItemClick={handleMenuItemClick} />
              )}
              {activeTab === "Stok Formu" && <StockForm />}
              {activeTab === "Bundle/Set Stoklar" && <BundleSetStocks />}
              {activeTab === "Bundle/Set Stok Formu" && <BundleSetStockForm />}
              {activeTab === "Hizmet - Masraflar" && <ServicesCosts />}
              {activeTab === "Fişler" && <StockVouchers />}
              {activeTab === "Hareketler" && <StockMovements />}
              {activeTab === "Hızlı Stok" && <QuickStock />}
              {activeTab === "Kampanyalar" && <Campaigns />}
              {activeTab === "Barkod" && <BarcodeGenerator />}
              {activeTab === "Kategoriler" && <Categories />}
              {activeTab === "Özellikler" && <Properties />}
              {activeTab === "Cari Listesi" && (
                <CurrentList onMenuItemClick={handleMenuItemClick} />
              )}
              {activeTab === "Cari Kategorileri" && <CurrentCategories />}
              {activeTab === "Cari Formu" && <CurrentForm />}
              {activeTab === "Hesap Özeti" && <AccountSummary />}
              {activeTab === "Depo Listesi" && <Warehouses />}
              {activeTab === "Fatura/İrsaliye Listesi" && (
                <InvoiceListPage onMenuItemClick={handleMenuItemClick} />
              )}
              {activeTab === "Hızlı Satış" && <QuickSales />}
              {activeTab === "Cari İşlemleri" && (
                <CurrentTransactions onMenuItemClick={handleMenuItemClick} />
              )}
              {activeTab === "Kasa İşlemleri" && <VaultOperations />}
              {activeTab === "Banka İşlemleri" && <BankOperations />}
              {activeTab === "POS İşlemleri" && <PosOperations />}
              {activeTab === "Tanımlar" && <ApiDocumentation />}
              {activeTab === "Alış Faturası" && <PurchaseInvoice />}
              {activeTab === "Satış Faturası" && <SalesInvoice />}
              {activeTab === "Sipariş Hazırlama" && <OrderPreparation />}
              {activeTab === "Kullanıcılar" && <UsersPage />}
            </TabContainer>
          </main>
        </div>
        <CampaignDialog />
      </div>
    </ToastProvider>
  );
}
