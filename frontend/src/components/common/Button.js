"use client"
import { Link } from "react-router-dom"

const Button = ({ children, variant = "primary", className = "", onClick, type = "button", to, ...props }) => {
  const baseClasses = "btn"
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()
  
  // Si 'to' est fourni, retourner un Link de React Router, sinon un bouton standard
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
