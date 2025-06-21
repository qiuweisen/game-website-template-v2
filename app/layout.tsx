import { siteConfig } from '@/lib/config/site';
import './globals.css';

import type { ReactNode } from 'react';

// is required, even if it's just passing children through.
export default function RootLayout({ children }: { children: ReactNode }) {
    // 从配置中获取用户的自定义内容
  const customHeadContent = siteConfig.customHeadContent || '';
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {customHeadContent && (
          <div dangerouslySetInnerHTML={{ __html: customHeadContent }} />
        )}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
