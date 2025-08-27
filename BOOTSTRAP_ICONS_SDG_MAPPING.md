# Bootstrap Icons for UN SDG Goals - YesuVeda Website

This document maps the Bootstrap Icons used for each UN Sustainable Development Goal (SDG) on the YesuVeda website.

## Updated Tagline
**"Christ Our Power, Wisdom"** - Reflecting the Christian foundation of YesuVeda's wellness and sustainability approach.

## Bootstrap Icons Implementation

### External Resources Added
```html
<!-- Bootstrap Icons CDN -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
```

## SDG Goals with Bootstrap Icons

### 1. SDG 1: No Poverty
- **Icon**: `bi bi-coin`
- **Animation**: `bounce-animation`
- **Services**: Skill Training, Livelihood Support
- **Description**: Livelihood support, skill training, and economic empowerment programs

### 2. SDG 3: Good Health & Well-Being
- **Icon**: `bi bi-heart-pulse`
- **Animation**: `pulse-animation`
- **Services**: Health Camps, Mental Health, Nutrition
- **Description**: Comprehensive wellness programs addressing physical, mental, and spiritual health

### 3. SDG 4: Quality Education
- **Icon**: `bi bi-book`
- **Animation**: `swing-animation`
- **Services**: Online Courses, Vocational Training
- **Description**: Educational programs, online courses, and vocational training opportunities

### 4. SDG 5: Gender Equality
- **Icon**: `bi bi-gender-ambiguous`
- **Animation**: `shake-animation`
- **Services**: Gender Training, Family Support
- **Description**: Promoting equality, respect, and dignity for all people through inclusive programs

### 5. SDG 6: Clean Water & Sanitation
- **Icon**: `bi bi-droplet`
- **Animation**: `float-animation`
- **Services**: Water Projects, Sanitation
- **Description**: Clean water projects ensuring access to safe water as a basic human right

### 6. SDG 8: Decent Work & Economic Growth
- **Icon**: `bi bi-briefcase`
- **Animation**: `bounce-animation`
- **Services**: Leadership Training, Workplace Chaplaincy
- **Description**: Professional development and sustainable economic opportunities

### 7. SDG 10: Reduced Inequalities
- **Icon**: `bi bi-people`
- **Animation**: `pulse-animation`
- **Services**: Community Outreach, Disaster Relief
- **Description**: Inclusive programs addressing social and economic disparities

### 8. SDG 13: Climate Action
- **Icon**: `bi bi-globe`
- **Animation**: `swing-animation`
- **Services**: Eco-Living, Organic Farming
- **Description**: Environmental stewardship and sustainable living practices

### 9. SDG 16: Peace, Justice & Strong Institutions
- **Icon**: `bi bi-peace`
- **Animation**: `float-animation`
- **Services**: Conflict Resolution, Faith Counseling
- **Description**: Promoting peace, reconciliation, and justice through faith-based approaches

### 10. SDG 17: Partnerships for Goals
- **Icon**: `bi bi-people-fill`
- **Animation**: `shake-animation`
- **Services**: Strategic Partnerships, Global Outreach
- **Description**: Building collaborative partnerships to achieve sustainable development goals

## CSS Styling for Bootstrap Icons

```css
.sdg-icon {
    width: 60px;
    height: 60px;
    margin-bottom: var(--space-4);
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}

.sdg-icon i {
    font-size: 2rem;
    color: white;
    filter: brightness(0) invert(1);
    transition: all var(--transition-base);
}
```

## Animation Classes Applied

Each SDG icon has one of these animation classes:
- `bounce-animation`: Gentle bouncing effect
- `pulse-animation`: Pulsing/breathing effect
- `swing-animation`: Swinging motion
- `shake-animation`: Gentle shaking
- `float-animation`: Floating up and down

## Benefits of Bootstrap Icons vs Image Files

### Advantages
✅ **Scalable**: Vector-based, crisp at any size  
✅ **Lightweight**: No separate image files to load  
✅ **Customizable**: Easy to change colors via CSS  
✅ **Accessible**: Better screen reader support  
✅ **Performance**: Faster loading, cached with CSS  
✅ **Maintainable**: No image file management needed  

### SEO & Accessibility
- All icons include `aria-label` attributes
- Semantic meaning preserved with descriptive labels
- Better for screen readers than image alt text
- Consistent styling across all icons

## Alternative Icon Options

If different icons are preferred, here are alternatives:

### SDG 1 (No Poverty)
- `bi bi-cash-stack` - Money stack
- `bi bi-wallet2` - Wallet
- `bi bi-piggy-bank` - Savings

### SDG 3 (Health)
- `bi bi-hospital` - Hospital
- `bi bi-bandaid` - First aid
- `bi bi-activity` - Health activity

### SDG 4 (Education)
- `bi bi-mortarboard` - Graduation cap
- `bi bi-journal-text` - Journal
- `bi bi-pencil-square` - Education

### SDG 5 (Gender Equality)
- `bi bi-gender-male` - Male symbol
- `bi bi-gender-female` - Female symbol
- `bi bi-people` - People

### SDG 6 (Water)
- `bi bi-water` - Water waves
- `bi bi-cloud-rain` - Rain
- `bi bi-cup-straw` - Drinking

### SDG 8 (Work)
- `bi bi-building` - Building/office
- `bi bi-tools` - Tools
- `bi bi-graph-up-arrow` - Growth

### SDG 10 (Inequalities)
- `bi bi-arrows-expand` - Expanding
- `bi bi-person-plus` - Adding people
- `bi bi-hands-clapping` - Unity

### SDG 13 (Climate)
- `bi bi-tree` - Tree/nature
- `bi bi-sun` - Solar energy
- `bi bi-thermometer` - Temperature

### SDG 16 (Peace)
- `bi bi-shield-check` - Security
- `bi bi-balance-scale` - Justice
- `bi bi-handshake` - Agreement

### SDG 17 (Partnerships)
- `bi bi-person-hearts` - Connection
- `bi bi-diagram-3` - Network
- `bi bi-globe-americas` - Global reach

## Implementation Notes

1. **CDN Usage**: Using Bootstrap Icons v1.11.0 from jsDelivr CDN
2. **Fallback**: Icons gracefully degrade if CDN is unavailable
3. **Color Scheme**: Icons use white color with invert filter for contrast
4. **Animation**: CSS animations applied via separate classes
5. **Responsive**: Icons scale appropriately on all devices

## Update Process

To change any icon:
1. Find the SDG card in `index.html`
2. Replace the `bi bi-[icon-name]` class
3. Maintain the animation class
4. Update the `aria-label` if needed
5. Test visual appearance and accessibility

---

**Updated for YesuVeda - Christ Our Power, Wisdom**  
*Comprehensive wellness through faith-based sustainable development*
