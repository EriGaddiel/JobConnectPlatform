
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, X } from "lucide-react";
import { JOB_TYPES, EXPERIENCE_LEVELS, JOB_CATEGORIES } from "@/lib/constants";

// Sub-component for displaying active filters
function ActiveFiltersDisplay({ filters, onRemoveFilter, onUpdateFilter }) {
  const getCategoryLabel = (value) => JOB_CATEGORIES.find(c => c.value === value)?.label;
  const getJobTypeLabel = (id) => JOB_TYPES.find(t => t.id === id)?.label;
  const getExperienceLevelLabel = (id) => EXPERIENCE_LEVELS.find(l => l.id === id)?.label;

  const activeFilterCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.location) count++;
    if (filters.category !== "all") count++;
    if (filters.jobType.length > 0) count += filters.jobType.length;
    if (filters.experienceLevel.length > 0) count += filters.experienceLevel.length;
    if (filters.remote) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++;
    return count;
  };

  if (activeFilterCount() === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {filters.keyword && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.keyword}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilter("keyword", "")}
                aria-label="Remove keyword filter"
              />
            </Badge>
          )}

          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilter("location", "")}
                aria-label="Remove location filter"
              />
            </Badge>
          )}

          {filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {getCategoryLabel(filters.category)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveFilter("category")}
                aria-label="Remove category filter"
              />
            </Badge>
          )}

          {filters.jobType.map(typeId => (
            <Badge key={typeId} variant="secondary" className="flex items-center gap-1">
              {getJobTypeLabel(typeId)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveFilter("jobType", typeId)}
                aria-label={`Remove ${getJobTypeLabel(typeId)} filter`}
              />
            </Badge>
          ))}

          {filters.experienceLevel.map(levelId => (
            <Badge key={levelId} variant="secondary" className="flex items-center gap-1">
              {getExperienceLevelLabel(levelId)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveFilter("experienceLevel", levelId)}
                aria-label={`Remove ${getExperienceLevelLabel(levelId)} filter`}
              />
            </Badge>
          ))}

          {filters.remote && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Remote
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveFilter("remote")}
                aria-label="Remove remote filter"
              />
            </Badge>
          )}

          {(filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilter("salaryRange", [0, 200000])}
                aria-label="Remove salary range filter"
              />
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function JobFilterSidebar({ onFiltersChange, activeFilters = {} }) {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "all",
    jobType: [],
    experienceLevel: [],
    salaryRange: [0, 200000], // Default salary range
    remote: false,
    ...activeFilters // Initialize with any active filters passed as props
  });

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleJobTypeChange = (typeId, checked) => {
    const newJobTypes = checked 
      ? [...filters.jobType, typeId]
      : filters.jobType.filter(id => id !== typeId);
    updateFilter("jobType", newJobTypes);
  };

  const handleExperienceChange = (levelId, checked) => {
    const newExperience = checked 
      ? [...filters.experienceLevel, levelId]
      : filters.experienceLevel.filter(id => id !== levelId);
    updateFilter("experienceLevel", newExperience);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      keyword: "",
      location: "",
      category: "all",
      jobType: [],
      experienceLevel: [],
      salaryRange: [0, 200000],
      remote: false
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const removeFilter = (filterType, value = null) => {
    if (filterType === "jobType" && value) {
      handleJobTypeChange(value, false);
    } else if (filterType === "experienceLevel" && value) {
      handleExperienceChange(value, false);
    } else if (filterType === "remote") {
      updateFilter("remote", false);
    } else if (filterType === "category") {
      updateFilter("category", "all");
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.location) count++;
    if (filters.category !== "all") count++;
    if (filters.jobType.length > 0) count += filters.jobType.length;
    if (filters.experienceLevel.length > 0) count += filters.experienceLevel.length;
    if (filters.remote) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++; // Check if salary range is not default
    return count;
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All ({getActiveFilterCount()})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Keyword Search */}
          <div className="space-y-2">
            <Label htmlFor="keyword">Job Title or Keywords</Label>
            <Input
              id="keyword"
              placeholder="e.g., Web Developer"
              value={filters.keyword}
              onChange={(e) => updateFilter("keyword", e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="e.g., New York, NY"
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Job Category */}
          <div className="space-y-2">
            <Label>Job Category</Label>
            <RadioGroup 
              value={filters.category} 
              onValueChange={(value) => updateFilter("category", value)}
            >
              {JOB_CATEGORIES.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.value} id={category.value} />
                  <Label htmlFor={category.value}>{category.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Job Type */}
          <div className="space-y-3">
            <Label>Job Type</Label>
            {JOB_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={filters.jobType.includes(type.id)}
                  onCheckedChange={(checked) => handleJobTypeChange(type.id, checked)}
                />
                <Label htmlFor={type.id}>{type.label}</Label>
              </div>
            ))}
          </div>

          <Separator />

          {/* Experience Level */}
          <div className="space-y-3">
            <Label>Experience Level</Label>
            {EXPERIENCE_LEVELS.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={level.id}
                  checked={filters.experienceLevel.includes(level.id)}
                  onCheckedChange={(checked) => handleExperienceChange(level.id, checked)}
                />
                <Label htmlFor={level.id}>{level.label}</Label>
              </div>
            ))}
          </div>

          <Separator />

          {/* Salary Range */}
          <div className="space-y-3">
            <Label>Salary Range</Label>
            <div className="px-2">
              <Slider
                value={filters.salaryRange}
                onValueChange={(value) => updateFilter("salaryRange", value)}
                max={200000}
                min={0}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>${filters.salaryRange[0].toLocaleString()}</span>
                <span>${filters.salaryRange[1].toLocaleString()}+</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Remote Work */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remote"
              checked={filters.remote}
              onCheckedChange={(checked) => updateFilter("remote", checked)}
            />
            <Label htmlFor="remote">Remote work available</Label>
          </div>
        </CardContent>
      </Card>

      <ActiveFiltersDisplay
        filters={filters}
        onRemoveFilter={removeFilter}
        onUpdateFilter={updateFilter}
      />
    </div>
  );
}
