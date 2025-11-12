import { useSelector } from 'react-redux';
import { useBetween } from 'use-between';
import { Dropdown } from 'react-bootstrap';
import './SortAndFilter.scss';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SortAndFilter = () => {
    const state = useSelector((state) => state.data);
    const {
        courses, setCourses,
        categories,
        reload, setReload,
    } = useBetween(state.useShareState);
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [maxCoursePrice, setMaxCoursePrice] = useState(500);
    const originalCoursesRef = useRef([]);

    useEffect(() => {
        if (Array.isArray(courses) && courses.length > 0 && originalCoursesRef.current.length === 0) {
            originalCoursesRef.current = courses;
            const maxPrice = Math.max(...courses.map(c => c.price || 0));
            setMaxCoursePrice(maxPrice);
            setPriceRange([0, maxPrice]);
        }
        
    }, [courses]);
    
    const handleLevelChange = (level) => {
        if (level === 'all') {
            setSelectedLevels([]);
        } else {
            if (selectedLevels.includes(level)) {
                setSelectedLevels(prev => prev.filter(l => l !== level));
            } else {
                setSelectedLevels(prev => [...prev, level]);
            }
        }
    };

    const handleFilter = () => {
        let filtered = [...originalCoursesRef.current];
     
        if (selectedLevels.length > 0) {
            filtered = filtered.filter(course =>
                Array.isArray(course.categories) &&
                selectedLevels.every(level => course.categories.includes(level))
            );
           
        }
        
        if (startDate) {
            const start = new Date(startDate);
            filtered = filtered.filter(course => new Date(course.date) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            filtered = filtered.filter(course => new Date(course.date) <= end);
        }

        const [minPrice, maxPrice] = priceRange;
        filtered = filtered.filter(course => course.price >= minPrice && course.price <= maxPrice);

        setCourses(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [selectedLevels, startDate, endDate, priceRange]);

    const sortItems = (type) => {
        const sorted = [...courses];
        if (type === 'nameAsc') sorted.sort((a, b) => a.name.localeCompare(b.name));
        else if (type === 'nameDesc') sorted.sort((a, b) => b.name.localeCompare(a.name));
        else if (type === 'dateAsc') sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        else if (type === 'dateDesc') sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        setCourses(sorted);
    };

    return (
        <div className="sortAndFilter d-flex gap-2">

            <Dropdown>
                <Dropdown.Toggle>
                    <i className="fas fa-filter"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-3" style={{ minWidth: '300px' }}>
                   <div> Filter:</div>
                    
                    <strong>By Categories</strong>
                  
                    <div className="categories-checkboxes mt-2">
                        <div className="d-flex align-items-center mb-1">
                            <input
                                type="checkbox"
                                id={`cat-all`}
                                checked={selectedLevels.length === 0}
                                onChange={() => handleLevelChange('all')}
                            />
                            <label htmlFor={`cat-all`} style={{ marginLeft: 6 }}>All</label>
                        </div>
                    
                        {categories.map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-1">
                                <input
                                    type="checkbox"
                                    id={`cat-${index}`}
                                    checked={selectedLevels.includes(item.level)}
                                    onChange={() => handleLevelChange(item.level)}
                                />
                                <label htmlFor={`cat-${index}`} style={{ marginLeft: 6, display: 'flex', alignItems: 'center' }}>
                                    <i className={item.icon} style={{ color: item.color, marginRight: 4 }}></i>
                                    {item.level}
                                </label>
                            </div>
                        ))}
                    </div>
              

                    <div className="mt-3">
                        <strong>By Date</strong>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-control mb-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="mt-3">
                        <strong>By Price</strong>
                        <Slider
                            range
                            min={0}
                            max={maxCoursePrice}
                            value={priceRange}
                            onChange={setPriceRange}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
                <Dropdown.Toggle><i className="fa-solid fa-up-down"></i></Dropdown.Toggle>
                <Dropdown.Menu>
                     <div> Sort:</div>
                    <Dropdown.Item onClick={() => sortItems('nameAsc')}>Name A → Z</Dropdown.Item>
                    <Dropdown.Item onClick={() => sortItems('nameDesc')}>Name Z → A</Dropdown.Item>
                    <Dropdown.Item onClick={() => sortItems('dateAsc')}>Date: Oldest → Newest</Dropdown.Item>
                    <Dropdown.Item onClick={() => sortItems('dateDesc')}>Date: Newest → Oldest</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <i
                className="fas fa-sync-alt"
                onClick={() => {
                    setReload(!reload);
                    setStartDate('');
                    setEndDate('');
                    setSelectedLevels([]);
                    setPriceRange([0, maxCoursePrice]);
                    setCourses(originalCoursesRef.current);
                }}
                
            />
        </div>
    );
};

export default SortAndFilter;
