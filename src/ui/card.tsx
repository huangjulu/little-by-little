import { cn } from "@/lib/utils";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm",
        className
      )}
      {...rest}
    />
  );
};

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...rest}
    />
  );
};

const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...rest}
    />
  );
};

const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...rest}
    />
  );
};

const CardAction: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...rest}
    />
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...rest} />
  );
};

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...rest}
    />
  );
};

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardAction.displayName = "CardAction";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
