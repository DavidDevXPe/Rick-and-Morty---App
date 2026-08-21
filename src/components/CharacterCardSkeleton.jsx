const CharacterCardSkeleton = () => (
    <article className='character_card character_card--skeleton' aria-hidden='true'>
        <div className='skeleton character_card_skeleton_image' />
        <div className='character_card_body'>
            <div className='skeleton character_card_skeleton_title' />
            <div className='skeleton character_card_skeleton_line' />
            <div className='skeleton character_card_skeleton_line character_card_skeleton_line--short' />
            <div className='character_card_divider' />
            <div className='skeleton character_card_skeleton_line' />
        </div>
    </article>
);

export default CharacterCardSkeleton;
