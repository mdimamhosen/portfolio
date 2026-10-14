import type { Handler } from '@netlify/functions';
const base = (process.env.PUBLIC_SITE_URL || 'https://mdimamhosen.netlify.app').replace(/\/$/, '');
const pages: Record<string,{title:string;description:string;intro:string;scope:string[];approach:string;project:string;projectUrl:string}> = {
  'backend-development': {
    title:'Backend Development', description:'Backend APIs, data models, authentication, and background work for web applications.',
    intro:'For teams that need a maintainable server side foundation for an application or integration.',
    scope:['REST API design and implementation','Data modeling and integration','Authentication and authorization','Background jobs and operational handoff'],
    approach:'I start with the domain model and access rules, then design endpoints, error handling, and deployment around the application’s actual traffic and maintenance needs.',
    project:'EduCoder', projectUrl:'https://edu-coder.vercel.app/'
  },
  'ai-integration': {
    title:'AI Integration and RAG Development', description:'AI features, retrieval augmented generation, and agent workflows integrated into useful products.',
    intro:'For teams with a concrete workflow or knowledge source that could benefit from an LLM powered feature.',
    scope:['Use case and data source assessment','Retrieval and prompt pipeline design','API integration and response handling','Evaluation, observability, and human review points'],
    approach:'I define what a useful answer or action looks like, build the smallest working pipeline, and test it against representative cases before expanding it.',
    project:'ClientServe AI', projectUrl:'https://clientserve.ai/'
  }
};
const styles = 'body{margin:0;background:#090d19;color:#f4f6fa;font:18px/1.7 system-ui,sans-serif}header,main,footer{max-width:800px;margin:auto;padding:24px}a{color:#6ed5ec}h1,h2{line-height:1.2}li{margin:.5em 0}.card{border:1px solid #344154;border-radius:12px;padding:18px;margin:16px 0}';
export const handler: Handler = async event => {
  const slug = event.path.match(/^\/services\/([a-z-]+)\/?$/)?.[1];
  const page = slug ? pages[slug] : undefined;
  if (slug && !page) return {statusCode:404,body:'Service page not found'};
  const title = page ? `${page.title} | Md. Imam Hosen` : 'Development Services | Md. Imam Hosen';
  const description = page?.description || 'Backend development and AI integration services by Md. Imam Hosen.';
  const path = slug ? `/services/${slug}` : '/services';
  const content = page ? `<p><a href="/services">Services</a> / ${page.title}</p><h1>${page.title}</h1><p>${page.intro}</p><h2>What I can deliver</h2><ul>${page.scope.map(x=>`<li>${x}</li>`).join('')}</ul><h2>Approach</h2><p>${page.approach}</p><h2>Related work</h2><p><a href="${page.projectUrl}" rel="noopener noreferrer">${page.project}</a> is an existing project featured in my portfolio. Project scope and contribution details can be discussed directly.</p><h2>Discuss a project</h2><p><a href="mailto:mimam22.cse@bu.ac.bd?subject=Development%20project">Email Md. Imam Hosen</a> with the problem, current stack, and expected timeline.</p>` : `<h1>Development services</h1><p>I work on application backends and practical AI integrations. Explore each service for scope, approach, and project context.</p>${Object.entries(pages).map(([key,value])=>`<div class="card"><h2><a href="/services/${key}">${value.title}</a></h2><p>${value.description}</p></div>`).join('')}`;
  const schema = page ? `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base+'/'},{'@type':'ListItem',position:2,name:'Services',item:base+'/services'},{'@type':'ListItem',position:3,name:page.title,item:base+path}]})}</script>` : '';
  return {statusCode:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600'},body:`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${base}${path}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${base}${path}">${schema}<style>${styles}</style></head><body><header><nav><a href="/">Md. Imam Hosen</a> · <a href="/services">Services</a> · <a href="/#contact">Contact</a></nav></header><main>${content}</main><footer><a href="/">Portfolio</a></footer></body></html>`};
};
