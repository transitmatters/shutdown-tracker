from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

EASTERN_TIME = ZoneInfo("US/Eastern")

# Cache duration constants (in seconds)
ONE_HOUR = 3600
ONE_YEAR = 31536000  # 365 days


def get_cache_max_age(query_params: dict) -> int:
    """
    Determine cache duration based on the date range in query parameters.

    For historical data (more than 2 weeks old), cache for 1 year.
    For recent data, cache for 1 hour.

    Args:
        query_params: Dictionary of query parameters from the request

    Returns:
        Cache max-age in seconds
    """
    cache_max_age = ONE_HOUR  # Default: 1 hour

    # Check if we have an end_date parameter
    end_date_str = query_params.get("end_date")
    if end_date_str:
        try:
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").replace(tzinfo=EASTERN_TIME)
            two_weeks_ago = datetime.now(EASTERN_TIME) - timedelta(days=14)

            # If data is from more than 2 weeks ago, it's historical and won't change
            if end_date < two_weeks_ago:
                cache_max_age = ONE_YEAR
        except ValueError:
            # If date parsing fails, use default cache duration
            pass

    return cache_max_age
