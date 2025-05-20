import { styled } from "@mui/system";
import { Box } from "@mui/material";
import bungieCoreTheme from "plxp-web-ui/themes/bungieCore";

export const InviteContainer = styled(Box)<{ theme?: typeof bungieCoreTheme }>(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper2,
    padding: `${theme.spacing(6)} ${theme.spacing(9)} ${theme.spacing(
      9
    )} ${theme.spacing(9)}`,
    borderRadius: theme.borderRadius.large,
    boxShadow: `0px 12px 32px 0px rgba(10, 11, 12, 0.40)`,

    [theme.breakpoints.down(theme.breakpoints.values.lg)]: {
      padding: `${theme.spacing(6)}`,
    },

    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
    },
  })
);
