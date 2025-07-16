-- Create view for customer metrics with actual data
CREATE OR REPLACE VIEW customer_metrics_view AS
SELECT 
    c.id,
    c."Client Name" as name,
    c."Client Email" as email,
    c."Phone Number" as phone,
    c."Marketing Email Opt-in" as marketing_email_opt_in,
    c."Marketing Text Opt In" as marketing_text_opt_in,
    c."Tags" as tags,
    c."First Seen" as first_seen,
    c."Last Seen" as last_seen,
    c."Birthday" as birthday,
    c."Address" as address,
    
    -- Calculate attendance metrics
    COUNT(ca.id) as total_classes_attended,
    MAX(ca.booking_date) as last_class_date,
    MIN(ca.booking_date) as first_class_date,
    
    -- Calculate membership status based on attendance
    CASE 
        WHEN COUNT(ca.id) = 0 THEN 'No Purchases'
        WHEN COUNT(ca.id) = 1 THEN 'First Class Booked'
        WHEN COUNT(ca.id) BETWEEN 2 AND 3 AND MAX(ca.booking_date) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Intro Offer'
        WHEN COUNT(ca.id) > 3 AND MAX(ca.booking_date) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active Members'
        WHEN COUNT(ca.id) > 1 AND MAX(ca.booking_date) >= CURRENT_DATE - INTERVAL '90 days' THEN 'Bought Membership'
        WHEN COUNT(ca.id) > 0 AND MAX(ca.booking_date) < CURRENT_DATE - INTERVAL '90 days' THEN 'Retention Risk'
        ELSE 'No Purchases'
    END as calculated_status,
    
    -- Calculate if recently active
    CASE 
        WHEN MAX(ca.booking_date) >= CURRENT_DATE - INTERVAL '30 days' THEN true
        ELSE false
    END as is_active_member,
    
    -- Calculate revenue (assuming $25 per class average)
    COUNT(ca.id) * 25.00 as estimated_lifetime_value
    
FROM clients c
LEFT JOIN class_attendance ca ON c.id::text = ca.customer_id::text
GROUP BY c.id, c."Client Name", c."Client Email", c."Phone Number", 
         c."Marketing Email Opt-in", c."Marketing Text Opt In", c."Tags",
         c."First Seen", c."Last Seen", c."Birthday", c."Address"
ORDER BY c."Client Name";

-- Create function to get customer metrics summary
CREATE OR REPLACE FUNCTION get_customer_metrics_summary()
RETURNS TABLE (
    total_clients bigint,
    active_members bigint,
    trial_members bigint,
    new_this_month bigint,
    no_purchases bigint,
    first_class_booked bigint,
    intro_offer bigint,
    bought_membership bigint,
    retention_risk bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE calculated_status = 'Active Members') as active_members,
        COUNT(*) FILTER (WHERE calculated_status = 'Intro Offer') as trial_members,
        COUNT(*) FILTER (WHERE first_class_date >= CURRENT_DATE - INTERVAL '30 days') as new_this_month,
        COUNT(*) FILTER (WHERE calculated_status = 'No Purchases') as no_purchases,
        COUNT(*) FILTER (WHERE calculated_status = 'First Class Booked') as first_class_booked,
        COUNT(*) FILTER (WHERE calculated_status = 'Intro Offer') as intro_offer,
        COUNT(*) FILTER (WHERE calculated_status = 'Bought Membership') as bought_membership,
        COUNT(*) FILTER (WHERE calculated_status = 'Retention Risk') as retention_risk
    FROM customer_metrics_view;
END;
$$ LANGUAGE plpgsql;

-- Create function to get filtered customers
CREATE OR REPLACE FUNCTION get_filtered_customers(filter_stage text DEFAULT 'all')
RETURNS TABLE (
    id uuid,
    name text,
    email text,
    phone text,
    marketing_email_opt_in text,
    marketing_text_opt_in text,
    tags text,
    first_seen text,
    last_seen text,
    birthday text,
    address text,
    total_classes_attended bigint,
    last_class_date timestamp with time zone,
    first_class_date timestamp with time zone,
    calculated_status text,
    is_active_member boolean,
    estimated_lifetime_value numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cmv.id,
        cmv.name,
        cmv.email,
        cmv.phone,
        cmv.marketing_email_opt_in,
        cmv.marketing_text_opt_in,
        cmv.tags,
        cmv.first_seen,
        cmv.last_seen,
        cmv.birthday,
        cmv.address,
        cmv.total_classes_attended,
        cmv.last_class_date,
        cmv.first_class_date,
        cmv.calculated_status,
        cmv.is_active_member,
        cmv.estimated_lifetime_value
    FROM customer_metrics_view cmv
    WHERE 
        CASE 
            WHEN filter_stage = 'all' THEN true
            WHEN filter_stage = 'no-purchases' THEN cmv.calculated_status = 'No Purchases'
            WHEN filter_stage = 'first-class-booked' THEN cmv.calculated_status = 'First Class Booked'
            WHEN filter_stage = 'intro-offer' THEN cmv.calculated_status = 'Intro Offer'
            WHEN filter_stage = 'bought-membership' THEN cmv.calculated_status = 'Bought Membership'
            WHEN filter_stage = 'active-members' THEN cmv.calculated_status = 'Active Members'
            WHEN filter_stage = 'retention-risk' THEN cmv.calculated_status = 'Retention Risk'
            ELSE true
        END
    ORDER BY cmv.name;
END;
$$ LANGUAGE plpgsql;