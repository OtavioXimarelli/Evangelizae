import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

function redirect(request: NextRequest, pathname: string, hash = '') {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  url.hash = hash;
  return NextResponse.redirect(url, 307);
}

export default function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return redirect(request, pathname.replace(/^\/en(?=\/|$)/, '/pt'));
  }

  const legacyDestination = pathname.match(/^\/pt\/(profile|ai|intentions)$/)?.[1];
  if (legacyDestination === 'profile') return redirect(request, '/pt/settings');
  if (legacyDestination === 'ai' || legacyDestination === 'intentions') {
    return redirect(request, '/pt/about', '#roadmap');
  }

  const onboarded = request.cookies.get('evangelizae_onboarded')?.value === '1';
  const brandVisit = request.nextUrl.searchParams.get('via') === 'selo';
  if (onboarded && !brandVisit && ['/', '/pt', '/pt/inicio', '/inicio'].includes(pathname)) {
    return redirect(request, '/pt/sanctuary');
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|sw\\.js|manifest\\.webmanifest|.*\\..*).*)'],
};
