import LoginAndSignUp from "@/components/loginAndSignUp";
import React from "react";

//INTERNAL IMPORT

const signUp = () => {
  return (
    <div>
      <div>
        <h1>Đăng Ký</h1>
        <LoginAndSignUp />
        <p>
          Người dùng mới? <a href="#">Tạo tài khoản</a>
        </p>
      </div>
    </div>
  );
};

export default signUp;
