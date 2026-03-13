declare module "opencc-js" {
  type Locale = "cn" | "tw" | "twp" | "hk" | "jp" | "t";

  interface ConverterOptions {
    from: Locale;
    to: Locale;
  }

  type Converter = (text: string) => string;

  export function Converter(options: ConverterOptions): Converter;
}
