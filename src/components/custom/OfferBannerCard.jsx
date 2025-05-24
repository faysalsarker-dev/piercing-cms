import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

export default function OfferBannerCard({ offer = {}, setDeleteId, setOpen }) {
  return (
    <div className="relative">
      {/* Delete Button (outside anchor for accessibility) */}
      <Button
        onClick={() => {
          setDeleteId(offer?._id);
          setOpen(true);
        }}
        size="icon"
        variant="ghost"
        className="absolute top-3 left-3 text-red-500 bg-white z-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <a
        href={offer?.redirectUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden relative group border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Background Image */}
        <div
          className="h-52 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${import.meta.env.VITE_API}/images/${offer?.imageUrl})`,
          }}
        >
          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={offer?.isActive ? 'default' : 'destructive'}>
              {offer?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-colors duration-300"></div>

          {/* Title and Content (Centered) */}
          <div className="absolute inset-0 p-4 w-full text-white z-10 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h2 className="text-lg font-semibold mb-3">{offer?.title}</h2>
              <div className="space-y-2 text-sm text-gray-200 max-h-36 overflow-y-auto">
                {offer?.content.map((htmlString, index) => (
                  <div
                    key={index}
                    className="prose prose-sm text-gray-100"
                    dangerouslySetInnerHTML={{ __html: htmlString }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

OfferBannerCard.propTypes = {
  offer: PropTypes.shape({
    imageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(PropTypes.string).isRequired,
    redirectUrl: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
  }).isRequired,
  setDeleteId: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};
