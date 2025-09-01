import * as React from "react";

export function Tabs({ defaultValue, className = "", children, ...props }) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <div className={`tabs ${className}`} {...props}>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { value, setValue });
        }
        if (child.type === TabsContent) {
          return value === child.props.value ? child : null;
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ value, setValue, className = "", children, ...props }) {
  return (
    <div className={`flex ${className}`} {...props}>
      {React.Children.map(children, child => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, { isActive: value === child.props.value, onClick: () => setValue(child.props.value) });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, isActive, onClick, className = "", children, ...props }) {
  return (
    <button className={`px-4 py-2 rounded ${isActive ? "bg-card font-bold" : "bg-muted text-muted-foreground"} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children, ...props }) {
  return (
    <div className={`pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
