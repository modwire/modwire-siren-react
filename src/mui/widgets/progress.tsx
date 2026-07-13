import LinearProgress from "@mui/material/LinearProgress";

export interface ProgressWidgetProps {
  readonly name: string;
}

export function ProgressWidget({
  name,
}: ProgressWidgetProps): React.JSX.Element {
  return <LinearProgress aria-label={`${name} in progress`} />;
}
