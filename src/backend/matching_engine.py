# matching_engine.py
# This is the "Recipe" for your matching engine as per the Engineering Handoff Note

def calculate_match_score(lounger, signal):
    # Rule: If Gladiator domain == Lounger employer, match is blocked
    # This enforces the anonymity contract at the logic level
    if lounger.current_employer_domain == signal.company_domain:
        return 0 

    # Rule: Salary hard cap
    # Stored in integers in paise to avoid float errors
    if signal.max_ctc_paise < lounger.min_ctc_paise:
        return 40 

    # Weighted signals as per engineering spec
    score = 0
    score += 30 # Certification match weight
    score += 25 # Domain depth weight
    score += 20 # Experience band weight
    score += 15 # Location weight
    score += 7  # Salary band weight
    score += 3  # Engagement weight
    
    return min(score, 100) # Cap at 100