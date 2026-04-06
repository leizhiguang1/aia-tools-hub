import type { Dictionary } from "@/lib/dictionaries";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {dict.footer.copyright}
      </div>
    </footer>
  );
}
