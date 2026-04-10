export type Corner = 'tl' | 'tr' | 'bl' | 'br';
export type ArmBone = 'LeftArm' | 'RightArm';

export type Project = {
  id: string;
  title: string;
  role: string;
  desc: string;
  href: string;
  badge: string;
  badgeFeatured?: boolean;
  speech: string;
  corner: Corner;
  // Which bone points at this card. Mirrored on purpose: cards on the
  // viewer's right are reached by the character's left arm and vice versa,
  // because the character faces the camera.
  pointingArm: ArmBone;
};

export const projects: Project[] = [
  {
    id: 'astrologia',
    title: 'Astrologia.guru',
    role: 'Founder · Webflow → React + C#',
    desc:
      'Revenue-generating astrology web app. Launched MVP on Webflow in 2 weeks, migrated to React + C# at scale.',
    href: 'https://astrologia.guru',
    badge: '★ Featured · Own Product',
    badgeFeatured: true,
    speech: 'Astrologia.guru — my own product! ✨',
    corner: 'tl',
    pointingArm: 'RightArm',
  },
  {
    id: 'novastorm',
    title: 'Novastorm.ai',
    role: 'Founder · Webflow → React',
    desc:
      'Second own product. Same playbook: fast Webflow MVP, then custom React rebuild once direction was clear.',
    href: 'https://novastorm.ai',
    badge: '★ Featured · Own Product',
    badgeFeatured: true,
    speech: 'Novastorm.ai — also mine! 🚀',
    corner: 'tr',
    pointingArm: 'LeftArm',
  },
  {
    id: 'synder',
    title: 'Synder',
    role: 'Sr. Front-End · 7 yrs',
    desc:
      'Owned ~90% of frontend. 300+ components, 50% faster page loads, 99.5% uptime, 12% conversion lift.',
    href: 'https://synder.com',
    badge: 'YC21 · FinTech SaaS',
    speech: 'Synder, YC21 — 7 years here 💎',
    corner: 'bl',
    pointingArm: 'RightArm',
  },
  {
    id: 'adhese',
    title: 'Adhese',
    role: 'Full-Stack · React + NestJS + Java',
    desc:
      'High-performance ad delivery platform across Europe. Shipped first PR in 3 days, 5 features in first month.',
    href: '#',
    badge: 'Current · AdTech',
    speech: 'Currently at Adhese 🛠',
    corner: 'br',
    pointingArm: 'LeftArm',
  },
];
