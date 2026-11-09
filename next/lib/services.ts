// Content moved verbatim from netlify/functions/services-page.ts; FAQs restate that same content.
export type Service = { title: string; description: string; intro: string; scope: string[]; approach: string; project: string; projectUrl: string; faq: { q: string; a: string }[] };

export const SERVICES: Record<string, Service> = {
  'backend-development': {
    title: 'Backend Development', description: 'Backend APIs, data models, authentication, and background work for web applications.',
    intro: 'For teams that need a maintainable server side foundation for an application or integration.',
    scope: ['REST API design and implementation', 'Data modeling and integration', 'Authentication and authorization', 'Background jobs and operational handoff'],
    approach: 'I start with the domain model and access rules, then design endpoints, error handling, and deployment around the application’s actual traffic and maintenance needs.',
    project: 'EduCoder', projectUrl: 'https://edu-coder.vercel.app/',
    faq: [
      { q: 'What does a backend engagement include?', a: 'REST API design and implementation, data modeling and integration, authentication and authorization, and background jobs with an operational handoff.' },
      { q: 'Where does the work start?', a: 'With the domain model and access rules. Endpoints, error handling, and deployment are designed after that, around real traffic and maintenance needs.' },
      { q: 'How do I start a project?', a: 'Email mimam22.cse@bu.ac.bd with the problem, your current stack, and the expected timeline.' },
    ],
  },
  'ai-integration': {
    title: 'AI Integration and RAG Development', description: 'AI features, retrieval augmented generation, and agent workflows integrated into useful products.',
    intro: 'For teams with a concrete workflow or knowledge source that could benefit from an LLM powered feature.',
    scope: ['Use case and data source assessment', 'Retrieval and prompt pipeline design', 'API integration and response handling', 'Evaluation, observability, and human review points'],
    approach: 'I define what a useful answer or action looks like, build the smallest working pipeline, and test it against representative cases before expanding it.',
    project: 'ClientServe AI', projectUrl: 'https://clientserve.ai/',
    faq: [
      { q: 'Which projects are a good fit for AI integration?', a: 'Teams with a concrete workflow or knowledge source that could benefit from an LLM powered feature.' },
      { q: 'How is quality checked?', a: 'A useful answer is defined first, then the smallest working pipeline is tested against representative cases, with evaluation, observability, and human review points.' },
      { q: 'How do I start a project?', a: 'Email mimam22.cse@bu.ac.bd with the problem, your current stack, and the expected timeline.' },
    ],
  },
};
