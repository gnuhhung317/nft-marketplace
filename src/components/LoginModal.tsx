import React, { useState, useContext } from "react";
import { WalletContext } from "../Context/WalletContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoWallet } from "react-icons/io5";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleLogin = async () => {
    console.log("Clicked login button");
    try {
      if (typeof onLogin !== 'function') {
        console.error('onLogin is not a function:', onLogin);
        setError('Trình xử lý đăng nhập chưa được cấu hình đúng');
        return;
      }
      
      console.log("Before calling onLogin with:", {username, password});
      await onLogin(username, password);
      console.log("After onLogin completed successfully");
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-main-bg border border-primary p-8 rounded-2xl shadow-custom max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <IoWallet className="text-icons text-4xl mr-3" />
          <h2 className="text-2xl font-semibold text-primary">Kết nối với Dragon Wallet</h2>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Tên đăng nhập</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-icons text-primary"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-icons text-primary"
              placeholder="Nhập mật khẩu"
            />
          </div>
          
          <div className="pt-2 space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full"
            >
              Kết nối ví
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-icons text-primary hover:bg-icons/20"
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
