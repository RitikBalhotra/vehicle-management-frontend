import { Paper, Typography } from "@mui/material";

const StatsCard = ({ title, value, onClick, bg = "#1976d2" }: { title: string; value: any; onClick: () => void; bg?: string }) => {
  return (
    <Paper
      elevation={4}
      onClick={onClick}
      sx={{
        p: 2,
        bgcolor: bg,
        color: "#fff",
        cursor: "pointer",
        borderRadius: 2,
        minHeight: 100,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </Paper>
  );
};

export default StatsCard;
