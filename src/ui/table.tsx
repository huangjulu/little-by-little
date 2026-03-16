"use client";

import { cn } from "@/lib/utils";

const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...rest}
      />
    </div>
  );
};

const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...rest}
    />
  );
};

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...rest}
    />
  );
};

const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...rest}
    />
  );
};

const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...rest}
    />
  );
};

const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...rest}
    />
  );
};

const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...rest}
    />
  );
};

const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = (
  props
) => {
  const { className, ...rest } = props;
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...rest}
    />
  );
};

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
