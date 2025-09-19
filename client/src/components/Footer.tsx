import React, { memo } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

function Footer(props: Props) {
  return <footer {...props}>Footer</footer>;
}

export default memo(Footer);
