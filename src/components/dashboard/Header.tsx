import { Link, useLocation } from "react-router-dom";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Leads', href: '/leads' },
    { name: 'Customers', href: '/customers' },
    { name: 'Classes', href: '/classes' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-gradient-primary border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border border-border">
                <span className="text-primary font-bold text-sm">T</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Talo Yoga Studio
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive(item.href) 
                      ? 'text-foreground border-b-2 border-primary pb-1' 
                      : 'text-foreground/70'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-accent-foreground">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      EM
                    </AvatarFallback>
                  </Avatar>
                  <span>Emily</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}