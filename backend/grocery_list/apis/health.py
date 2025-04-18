import logging
from django.http import JsonResponse
from django.db import connection

logger = logging.getLogger(__name__)

class HealthAPI:

    @staticmethod
    def check(request):
        if request.method == 'GET':
            logger.info('health check endpoint called')
            
            # Check database connection
            try:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1")
                    db_status = "ok"
            except Exception as e:
                db_status = f"error: {str(e)}"
            
            return JsonResponse({
                "status": "healthy",
                "database": db_status,
                "version": "1.0.0"
            })
