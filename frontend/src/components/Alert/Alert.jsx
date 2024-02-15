import { useState } from "react";
import "./alert.css";
const Alert = ({ children, varient ,className,ref}) => {
  
  const handleVisibility = () => {
    setShow(prev=>!prev);
  };
  return (
    <>
   
        <div ref={ref} className={`alert alert-${varient} ${className}`}>
          {children}
        </div>
      
    </>
  );
};

export default Alert;
