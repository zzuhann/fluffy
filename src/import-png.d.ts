declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.JPG" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.otf" {
  const value: import("expo-font").FontSource;
  export default value;
}
