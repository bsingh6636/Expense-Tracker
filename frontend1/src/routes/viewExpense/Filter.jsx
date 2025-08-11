import MultiSelectSearch from "../../components/ui/multi-select-search";

const Filter = ({ filter, updateFilter, categories, friends, getExpenses }) => {  
    const isFriendCategorySelected = filter.category?.includes(12);

    const onFilterChange = ( data ) =>{
        getExpenses(data);
        updateFilter(data);
    }

    
    return (
        <div className="flex gap-10 mb-2" >
            <MultiSelectSearch placeholder='Select cateogry' options={categories} labelKey="name" valueKey="id" value={filter.category} callBack={(v) => { onFilterChange({ category: v }) }} />
           {
            isFriendCategorySelected &&

            <MultiSelectSearch placeholder='Select friends' options={friends} labelKey="name" valueKey="id" value={filter.friends} callBack={(v) => { onFilterChange({ friends: v }) }} />
           }
        </div>
    )
}

export default Filter;