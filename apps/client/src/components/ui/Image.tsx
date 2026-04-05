function Image(props: React.ComponentProps<"img">) {
  return <img {...props} loading={props.loading ?? "lazy"} decoding={props.decoding ?? "async"} />;
}

export default Image;
