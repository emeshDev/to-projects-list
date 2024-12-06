"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // bukan resolver/zod
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import xss from "xss";
import { Modal } from "./Modal";
import { useProtectedMutation } from "@/hooks/useProtectedMutation";
import { Volume1 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Only alphanumeric characters, spaces, hyphens and underscores are allowed"
    ), // Hanya izinkan karakter yang aman
});

type FormValues = z.infer<typeof formSchema>;

export interface Post {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostsResponse {
  posts: Post[];
}

interface DeleteResponse {
  success: boolean;
}

export default function PostsPage() {
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch posts
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await client.v1.getPosts.$get();
      const { posts } = (await res.json()) as PostsResponse;
      return posts;
    },
  });

  // Create post mutation
  const { mutate: createPost } = useProtectedMutation<Post, FormValues>(
    async (values) => {
      const sanitizedValues = {
        name: xss(values.name),
      };
      return client.v1.createPost.$post(sanitizedValues);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        form.reset();
      },
    }
  );

  const { mutate: updatePost } = useProtectedMutation<
    Post,
    { id: number; name: string }
  >(
    async (values) => {
      if (!selectedPost) throw new Error("No post selected");
      const sanitizedValues = {
        id: selectedPost.id,
        name: xss(values.name),
      };
      return client.v1.updatePost.$post(sanitizedValues);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        setIsUpdateModalOpen(false);
        form.reset();
      },
    }
  );

  const { mutate: deletePost } = useProtectedMutation<DeleteResponse, number>(
    async (id) => {
      if (!selectedPost) throw new Error("No post selected");
      return client.v1.deletePost.$post({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        setIsDeleteModalOpen(false);
        form.reset();
      },
    }
  );
  // Form handling
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const updateForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedPost?.name || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createPost(values);
  };

  const handleUpdateClick = (post: Post) => {
    setSelectedPost(post);
    updateForm.reset({ name: post.name });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>Enter a name for your new post</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Post</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>List of all posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts?.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p dangerouslySetInnerHTML={{ __html: xss(post.name) }} />
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={"outline"}
                      onClick={() => handleUpdateClick(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDeleteClick(post)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {/* Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Post"
      >
        <Form {...updateForm}>
          <form
            onSubmit={updateForm.handleSubmit((values) => {
              if (!selectedPost) return;
              updatePost({ id: selectedPost.id, name: values.name });
            })}
          >
            <FormField
              control={updateForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 space-x-2">
              <Button type="submit">Update</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Post"
      >
        <p className="mb-4">Are you sure you want to delete this post?</p>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={() => selectedPost && deletePost(selectedPost.id)}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
