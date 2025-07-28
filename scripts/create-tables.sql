-- -- Create scholarships table
-- CREATE TABLE IF NOT EXISTS scholarships (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--     institution_name TEXT NOT NULL,
--     amount DECIMAL(10,2) NOT NULL,
--     deadline DATE NOT NULL,
--     application_link TEXT,
--     notes TEXT,
--     status TEXT CHECK (status IN ('pending', 'applied', 'approved', 'rejected')) DEFAULT 'pending',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- Create activity_logs table
-- CREATE TABLE IF NOT EXISTS activity_logs (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--     scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
--     scholarship_name TEXT NOT NULL,
--     action TEXT NOT NULL,
--     old_status TEXT,
--     new_status TEXT,
--     details TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_scholarships_user_id ON scholarships(user_id);
-- CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
-- CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
-- CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
-- CREATE INDEX IF NOT EXISTS idx_activity_logs_scholarship_id ON activity_logs(scholarship_id);

-- -- Enable Row Level Security
-- ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- -- Create RLS policies for scholarships
-- CREATE POLICY "Users can view their own scholarships" ON scholarships
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own scholarships" ON scholarships
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own scholarships" ON scholarships
--     FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own scholarships" ON scholarships
--     FOR DELETE USING (auth.uid() = user_id);

-- -- Create RLS policies for activity_logs
-- CREATE POLICY "Users can view their own activity logs" ON activity_logs
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own activity logs" ON activity_logs
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -- Create function to automatically update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- Create trigger to automatically update updated_at
-- CREATE TRIGGER update_scholarships_updated_at 
--     BEFORE UPDATE ON scholarships 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_updated_at_column();


-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    deadline DATE NOT NULL,
    application_link TEXT,
    notes TEXT,
    status TEXT CHECK (status IN ('pending', 'applied', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    scholarship_name TEXT NOT NULL,
    action TEXT NOT NULL,
    old_status TEXT,
    new_status TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes (for faster searching/sorting)
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_activity_logs_scholarship_id ON activity_logs(scholarship_id);

-- Disable RLS (not needed)
ALTER TABLE scholarships DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- Auto-update updated_at timestamp on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_scholarships_updated_at 
    BEFORE UPDATE ON scholarships 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
