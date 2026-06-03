export const STATIC_PAGE_PATHS = {
  about: '/about',
  changelog: '/changelog',
  privacy: '/privacy',
  terms: '/terms',
  license: '/license',
}

export const STATIC_PAGES = {
  about: {
    title: 'About Iconify',
    updated: 'June 2, 2026',
    sections: [
      {
        heading: 'What we do',
        paragraphs: [
          'Iconify helps makers, startups, and design teams generate custom icon sets from a simple product description. Pick a style, choose your brand color, and download SVG and PNG exports ready for production.',
        ],
      },
      {
        heading: 'Why we built it',
        paragraphs: [
          'Most apps ship with the same off-the-shelf icon libraries. Iconify is built for teams that want icons that feel specific to their product — without hiring a designer or spending days in Figma.',
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'Describe your product, choose from six visual styles, and generate a consistent set in seconds. Free accounts include 6 icons; larger packs are available as one-time purchases with a commercial license included.',
        ],
      },
    ],
  },
  changelog: {
    title: 'Changelog',
    updated: 'June 2, 2026',
    releases: [
      {
        version: '0.1.0',
        date: 'June 2, 2026',
        items: [
          'Initial public release with AI-assisted icon generation',
          'Six visual styles and brand color customization',
          'SVG and PNG export with ZIP download',
          'Google sign-in and generation history',
          'Starter, Pro, and Studio one-time packs',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'June 2, 2026',
    sections: [
      {
        heading: 'Overview',
        paragraphs: [
          'This Privacy Policy explains how Iconify ("we", "us") collects, uses, and protects information when you use our website and studio.',
        ],
      },
      {
        heading: 'Information we collect',
        paragraphs: [
          'When you sign in with Google, we receive your name, email address, and profile picture from your Google account. We store your generation history (prompts, style, color, icon count, and generated icon metadata) in Firebase to power the History feature.',
          'If you purchase a pack, payment is processed by Stripe. We receive your email and order details needed to fulfill the purchase. We do not store full payment card numbers.',
        ],
      },
      {
        heading: 'How we use information',
        paragraphs: [
          'We use your account information to authenticate you, save your generations, and provide customer support. Order information is used to deliver purchased icon packs and send receipt or delivery emails when applicable.',
        ],
      },
      {
        heading: 'Third-party services',
        paragraphs: [
          'Iconify relies on Firebase (authentication and database), Stripe (payments), and the Noun Project (icon search and SVG assets where applicable). Each provider has its own privacy policy governing how they handle data.',
        ],
      },
      {
        heading: 'Data retention',
        paragraphs: [
          'We retain your account and generation history while your account is active. You may request deletion of your account and associated data by contacting us.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions about this policy? Email us at privacy@iconify.app.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'June 2, 2026',
    sections: [
      {
        heading: 'Agreement',
        paragraphs: [
          'By accessing or using Iconify, you agree to these Terms of Service. If you do not agree, do not use the service.',
        ],
      },
      {
        heading: 'The service',
        paragraphs: [
          'Iconify provides tools to generate and export icon sets based on your inputs. Features, pricing, and limits may change over time. We will make reasonable efforts to communicate material changes.',
        ],
      },
      {
        heading: 'Accounts',
        paragraphs: [
          'You must sign in with Google to use the studio. You are responsible for activity under your account and for keeping access to your Google account secure.',
        ],
      },
      {
        heading: 'Purchases',
        paragraphs: [
          'Paid packs are one-time purchases unless otherwise stated. Prices are shown at checkout. Refunds are available within 7 days of purchase if you are not satisfied — contact support with your order details.',
        ],
      },
      {
        heading: 'Acceptable use',
        paragraphs: [
          'You may not use Iconify to violate laws, infringe others\' rights, attempt to reverse engineer the service, or abuse rate limits or infrastructure.',
        ],
      },
      {
        heading: 'Disclaimer',
        paragraphs: [
          'Iconify is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions about these terms? Email us at legal@iconify.app.',
        ],
      },
    ],
  },
  license: {
    title: 'Icon License',
    updated: 'June 2, 2026',
    sections: [
      {
        heading: 'Commercial use',
        paragraphs: [
          'Icons generated through Iconify paid packs may be used in commercial products, client work, marketing materials, and design systems without attribution required.',
        ],
      },
      {
        heading: 'What you can do',
        paragraphs: [
          'Use icons in apps, websites, and print materials',
          'Modify, recolor, or resize icons for your projects',
          'Include icons in design kits or component libraries for your own products',
        ],
      },
      {
        heading: 'What you cannot do',
        paragraphs: [
          'Resell or sublicense raw icon files as a standalone icon pack or stock asset library',
          'Use icons in a competing icon generation or marketplace product',
          'Remove or misrepresent third-party attribution where required by underlying icon sources',
        ],
      },
      {
        heading: 'Free tier',
        paragraphs: [
          'Free generations (up to 6 icons) include the same commercial license for those specific icons once downloaded.',
        ],
      },
      {
        heading: 'Third-party icons',
        paragraphs: [
          'Some icons may be sourced from the Noun Project under their license terms. When applicable, attribution information is included in your export package.',
        ],
      },
    ],
  },
}

export function getStaticPageFromPath(pathname) {
  return Object.entries(STATIC_PAGE_PATHS).find(([, path]) => path === pathname)?.[0] || null
}
