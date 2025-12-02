import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { blogPosts } from '@/lib/blog-posts';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === post.imageId);

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <article className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
          {image && (
            <div className="relative mb-8 h-64 w-full rounded-lg md:h-96">
              <Image
                src={image.imageUrl}
                alt={post.title}
                data-ai-hint={image.imageHint}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          <Badge variant="secondary" className="mb-2">{post.category}</Badge>
          <h1 className="font-headline text-4xl font-bold">{post.title}</h1>
          
          <div className="mb-8 flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
          </div>
          
          <p className="lead">{post.excerpt}</p>

          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
}
