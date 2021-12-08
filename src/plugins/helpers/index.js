
const cases = ['least','stars','after','older','before'];
function containsAny(str) {
    let substrings = cases;
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null; 
}
// movies at least 5 stars
// movies with 6 stars and up
// movies with 5 stars at least

// movies made after 2020
// movies made before 2020
// movies older than 7 years

const Helper = {
    sfilter: (query) => {
        const is = containsAny(query);
        const num = query.replace(/\D/g,'');
        if (is !== null && num !== '') {
            let cleaned = query.replace('least','');
            if(is === 'least') {
                cleaned = containsAny(cleaned);
                if(cleaned !== null && cleaned === 'stars') {
                    return `vote_average.gte=${num}`;
                }
            } else if(is === 'stars') {
                return `vote_average.gte=${num}&vote_average.lte=${num}`;
            } else if(is === 'after') {
                //return `year=${num}`
                return `release_date.gte=${num}`
            } else if(is === 'before') {
                return `release_date.lte=${num}`
            } else if(is === 'older') {
                let year = new Date().getFullYear();
                year = year - num;
                return `release_date.lte=${year}`
            } else {
                return null;
            }
        }
        return null;
    },
}

export default Helper;