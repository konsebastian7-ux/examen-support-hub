-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON public.group_members;
DROP POLICY IF EXISTS "Users can view posts in groups they belong to" ON public.group_posts;
DROP POLICY IF EXISTS "Users can create posts in groups they belong to" ON public.group_posts;

-- Create new public policies for group_members
CREATE POLICY "Anyone can view group members"
ON public.group_members
FOR SELECT
TO authenticated
USING (true);

-- Create new public policies for group_posts
CREATE POLICY "Anyone can view group posts"
ON public.group_posts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can create group posts"
ON public.group_posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);