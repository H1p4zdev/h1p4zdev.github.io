import { useEffect } from "react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/nav-bar";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

const SettingGroup = ({ title, children }: SettingGroupProps) => (
  <div className="bg-dark-surface rounded-xl p-5 mb-6">
    <h3 className="text-xl font-bold text-white font-rajdhani mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface SettingItemProps {
  title: string;
  description: string;
  icon?: string;
  onClick?: () => void;
}

const SettingItem = ({ title, description, icon, onClick }: SettingItemProps) => (
  <div className="flex items-center justify-between py-2 border-b border-dark-lighter" onClick={onClick}>
    <div>
      <h4 className="font-medium text-white">{title}</h4>
      <p className="text-xs text-text-secondary">{description}</p>
    </div>
    {icon ? <i className={`${icon} text-text-secondary text-xl`}></i> : null}
  </div>
);

interface ToggleSettingProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSetting = ({ title, description, enabled, onToggle }: ToggleSettingProps) => (
  <div className="flex items-center justify-between py-2 border-b border-dark-lighter">
    <div>
      <h4 className="font-medium text-white">{title}</h4>
      <p className="text-xs text-text-secondary">{description}</p>
    </div>
    <Switch checked={enabled} onCheckedChange={onToggle} />
  </div>
);

export default function Settings() {
  const { currentUser, logOut } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  const handleLogout = async () => {
    try {
      await logOut();
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: "Your preference has been saved."
    });
  };

  const handleSettingClick = (setting: string) => {
    toast({
      title: setting,
      description: "This feature is coming soon."
    });
  };

  if (!currentUser) return null;

  return (
    <div className="settings-screen">
      <header className="bg-dark-surface p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <button className="mr-3 text-white" onClick={() => setLocation('/dashboard')}>
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold text-white font-rajdhani">SETTINGS</h1>
          </div>
        </div>
      </header>

      <div className="p-4 container mx-auto mb-20">
        {/* Account Settings */}
        <SettingGroup title="ACCOUNT SETTINGS">
          <SettingItem 
            title="Profile Information" 
            description="Update your personal details"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Profile Information")}
          />
          
          <SettingItem 
            title="Password & Security" 
            description="Manage your login details"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Password & Security")}
          />
          
          <SettingItem 
            title="Connected Accounts" 
            description="Link your social accounts"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Connected Accounts")}
          />
          
          <SettingItem 
            title="Delete Account" 
            description="Permanently remove your data"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Delete Account")}
          />
        </SettingGroup>
        
        {/* Notification Settings */}
        <SettingGroup title="NOTIFICATION SETTINGS">
          <ToggleSetting
            title="Tournament Reminders"
            description="Get alerts before your tournaments"
            enabled={true}
            onToggle={(value) => handleToggle("Tournament Reminders", value)}
          />
          
          <ToggleSetting
            title="Match Results"
            description="Notifications for match outcomes"
            enabled={true}
            onToggle={(value) => handleToggle("Match Results", value)}
          />
          
          <ToggleSetting
            title="Friend Requests"
            description="Alerts for new friend connections"
            enabled={false}
            onToggle={(value) => handleToggle("Friend Requests", value)}
          />
          
          <ToggleSetting
            title="Marketing Emails"
            description="Updates and promotional offers"
            enabled={false}
            onToggle={(value) => handleToggle("Marketing Emails", value)}
          />
        </SettingGroup>
        
        {/* App Settings */}
        <SettingGroup title="APP SETTINGS">
          <SettingItem 
            title="Language" 
            description="English (United States)"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Language")}
          />
          
          <SettingItem 
            title="Theme" 
            description="Dark mode"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Theme")}
          />
          
          <SettingItem 
            title="Data Usage" 
            description="Manage app data settings"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Data Usage")}
          />
        </SettingGroup>
        
        {/* Other Settings */}
        <SettingGroup title="">
          <SettingItem 
            title="Help & Support" 
            description="Get assistance with app issues"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Help & Support")}
          />
          
          <SettingItem 
            title="Privacy Policy" 
            description="Read our privacy terms"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Privacy Policy")}
          />
          
          <SettingItem 
            title="Terms of Service" 
            description="Read our user agreement"
            icon="ri-arrow-right-s-line"
            onClick={() => handleSettingClick("Terms of Service")}
          />
        </SettingGroup>
        
        <Button 
          onClick={handleLogout}
          className="gaming-btn w-full bg-error hover:bg-error/90 text-white font-bold py-3 px-4 rounded-lg mt-2 mb-6 font-rajdhani flex items-center justify-center"
        >
          <i className="ri-logout-box-line mr-2"></i> LOGOUT
        </Button>
        
        <p className="text-center text-text-secondary text-sm">App Version 1.0.0</p>
      </div>

      <NavBar />
    </div>
  );
}
