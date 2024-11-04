from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Faculty, Building, Classroom
from .serializers import FacultySerializer, BuildingSerializer, ClassroomSerializer

class FacultyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

class BuildingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer

    def list(self, request):
        faculty_id = request.query_params.get('faculty')
        if faculty_id:
            buildings = Building.objects.filter(faculty_id=faculty_id)
        else:
            buildings = Building.objects.all()
        serializer = self.get_serializer(buildings, many=True)
        return Response(serializer.data)

class ClassroomViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

    def list(self, request):
        building_id = request.query_params.get('building')
        floor = request.query_params.get('floor')
        if building_id and floor:
            classrooms = Classroom.objects.filter(building_id=building_id, floor=floor)
        elif building_id:
            classrooms = Classroom.objects.filter(building_id=building_id)
        else:
            classrooms = Classroom.objects.all()
        serializer = self.get_serializer(classrooms, many=True)
        return Response(serializer.data)
