import { UbNode, createNode } from './builder-tree';

export interface Preset {
  id: 'navbar' | 'hero' | 'signup' | 'pricing' | 'footer';
  label: string;
  build(): UbNode;
}

export const starterPage = (): UbNode =>
  createNode('section', { padding: 'lg' }, [
    createNode('stack', { gap: 16 }, [
      createNode('heading', { text: 'Build faster UIs', level: 1 }),
      createNode('text', { text: 'Drag components onto the canvas and nest them.', muted: true }),
      createNode('button', { label: 'Get started', icon: 'arrow', iconPosition: 'right' }),
    ]),
  ]);

export const PRESETS: Preset[] = [
  {
    id: 'navbar',
    label: 'Navbar',
    build: () =>
      createNode('section', { padding: 'sm', background: 'raised' }, [
        createNode('stack', { direction: 'row', justify: 'between', align: 'center' }, [
          createNode('heading', { text: 'Brand', level: 3 }),
          createNode('stack', { direction: 'row', gap: 16, align: 'center' }, [
            createNode('link', { text: 'Home', href: '#' }),
            createNode('link', { text: 'About', href: '#' }),
            createNode('button', { label: 'Sign in', size: 'sm', variant: 'outline' }),
          ]),
        ]),
      ]),
  },
  {
    id: 'hero',
    label: 'Hero',
    build: () =>
      createNode('section', { padding: 'lg', background: 'primary' }, [
        createNode('stack', { gap: 16, align: 'center' }, [
          createNode('heading', { text: 'Build faster UIs', level: 1, align: 'center' }),
          createNode('text', {
            text: 'Compose a page from reusable components.',
            align: 'center',
          }),
          createNode('button', { label: 'Get started', size: 'lg', tone: 'neutral' }),
        ]),
      ]),
  },
  {
    id: 'signup',
    label: 'Signup form',
    build: () =>
      createNode('card', { padding: 'lg' }, [
        createNode('stack', { gap: 12 }, [
          createNode('heading', { text: 'Create an account', level: 3 }),
          createNode('input', { label: 'Email', placeholder: 'you@example.com', type: 'email' }),
          createNode('input', { label: 'Password', type: 'password' }),
          createNode('button', { label: 'Sign up', fullWidth: true }),
        ]),
      ]),
  },
  {
    id: 'pricing',
    label: 'Pricing card',
    build: () =>
      createNode('card', { elevation: 'md', padding: 'lg' }, [
        createNode('heading', { text: 'Pro', level: 3 }),
        createNode('text', { text: 'Everything you need to ship.', muted: true }),
        createNode('heading', { text: '$19 / month', level: 2 }),
        createNode('button', { label: 'Choose plan', fullWidth: true }),
        createNode('badge', { text: 'Popular' }),
      ]),
  },
  {
    id: 'footer',
    label: 'Footer',
    build: () =>
      createNode('section', { padding: 'sm', background: 'raised' }, [
        createNode('stack', { direction: 'row', justify: 'between', align: 'center', wrap: true }, [
          createNode('text', { text: 'Footer text', size: 'sm', muted: true }),
          createNode('link', { text: 'Back to top', href: '#' }),
        ]),
      ]),
  },
];
