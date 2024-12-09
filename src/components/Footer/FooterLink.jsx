import { Link } from "@mui/material";

export default function FooterLink({ href, children }) {
  return (
    <Link 
      href={href} 
      color="inherit" 
      underline="hover" 
      fontSize={"12px"}
    >
      {children}
    </Link>
  );
}