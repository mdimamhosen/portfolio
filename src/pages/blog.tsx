import React from "react";

const Blog = () => {
  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog & Insights</h1>
      <article className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How AI Agents Are Transforming Automation</h2>
        <p className="text-muted-foreground mb-2">Discover how agentic AI systems are revolutionizing business workflows and automation.</p>
        <a href="#" className="text-primary hover:underline">Read more</a>
      </article>
      <article className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Mastering Full-Stack Web Development with React & Go</h2>
        <p className="text-muted-foreground mb-2">A practical guide to building highly performant, type-safe web applications from front to back.</p>
        <a href="#" className="text-primary hover:underline">Read more</a>
      </article>
      <article>
        <h2 className="text-xl font-semibold mb-2">SEO Best Practices for Developer Portfolios</h2>
        <p className="text-muted-foreground mb-2">Tips to help your portfolio rank higher on Google and attract more clients.</p>
        <a href="#" className="text-primary hover:underline">Read more</a>
      </article>
    </section>
  );
};

export default Blog;
