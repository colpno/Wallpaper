import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_HOME } from '~/constants/routeConstants.ts';
import { cn } from '~/utils/cssUtils.ts';
import { Container, Image } from '../index.ts';
import HeaderNavigation from './components/HeaderNavigation';

type Props = React.HTMLAttributes<HTMLDivElement>;

function Header({ children, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn('fixed top-0 left-0 right-0 bg-primary-1 z-header', props.className)}
    >
      {children ?? (
        <Container className="relative flex items-center justify-center px-4 h-full">
          <Link to={ROUTE_HOME} className="absolute left-0">
            <Image src="/vite-64.png" className="w-14" />
          </Link>
          <HeaderNavigation />
        </Container>
      )}
    </div>
  );
}

export default memo(Header);
