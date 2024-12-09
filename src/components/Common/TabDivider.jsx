import { Tab, Divider } from "@mui/material";

export default function TabDivider() {
  return (
    <Tab
      label=""
      icon={<Divider orientation="vertical" />}
      sx={{ maxWidth: "1px", minWidth: "1px", padding: "0.8rem 0" }}
      disabled
    />
  );
}
