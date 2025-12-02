import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { blogPosts, BlogPost } from '@/lib/blog-posts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

function BlogPostCard({ post }: { post: BlogPost }) {
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {image && (
            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                <Image
                    src={image.imageUrl}
                    alt={post.title}
                    data-ai-hint={image.imageHint}
                    fill
                    className="object-cover"
                />
                </div>
            </CardHeader>
        )}
        <CardContent className="p-6">
            <Badge variant="secondary" className="mb-2">{post.category}</Badge>
            <h3 className="font-headline text-xl font-bold">{post.title}</h3>
            <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
            <div className="mt-4 flex items-center text-sm font-semibold text-primary group-hover:underline">
            Leer más <ArrowRight className="ml-2 h-4 w-4" />
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}


export default function BlogPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Blog de Meridian Logistics
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Noticias, análisis y perspectivas sobre el mundo de la logística y el comercio global.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
