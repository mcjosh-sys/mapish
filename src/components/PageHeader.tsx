import { Separator } from "./ui/separator";

type Props = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: Props) => {
  return (
    <div className="w-full space-y-1">
      <h2 className="font-bold text-lg capitalize">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Separator className="my-4" />
    </div>
  );
};

export default PageHeader;
