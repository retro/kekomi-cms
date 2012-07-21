class Asset
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

<<<<<<< HEAD
  include Mongoid::TaggableWithContext
  include Mongoid::TaggableWithContext::AggregationStrategy::RealTime

=======
>>>>>>> 701834f098994796692ec4b9c7b90e3ec2d74e7c
  belongs_to :asset_folder

  # field <name>, :type => <type>, :default => <value>
  

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  field :file
<<<<<<< HEAD
  field :name
  field :size

  field :width
  field :height
  
  field :mime_type
  field :media_type

  field :gps
  field :exif

  taggable :colors

  mount_uploader :file, Uploader

  before_save :update_asset_attributes
  
  def has_thumb?
    self.media_type == "image"
  end

  private
  
    def update_asset_attributes
      self.mime_type = self.file.file.content_type
      self.media_type = self.mime_type.split('/').first
      self.size = self.file.file.size
      if self.mime_type.include? "image"
        img = Magick::Image::read(self.file.url).first
        self.width  = img.columns
        self.height = img.rows
        self.colors_array = extract_colors(img)
        img.destroy!
      end
      if self.mime_type == "image/jpeg" or self.mime_type == "image/tiff"
        exifr = EXIFR::JPEG.new(self.file.url) if self.mime_type == "image/jpeg"
        exifr = EXIFR::TIFF.new(self.file.url) if self.mime_type == "image/tiff"
        self.gps = exifr.gps
        self.exif = {
          copyright: exifr.exif.copyright,
          manufacturer: exifr.exif.make,
          model: exifr.exif.model,
          taken_at: exifr.exif.date_time
        } unless exifr.exif.nil?
      end
    end

    def extract_colors(img)
      img.resize_to_fit!(300) # resize the image to have faster quantization
      quantized = img.quantize(16) # quantize the photo to reduce number of colors

      colors = []
      quantized.color_histogram.each_pair do |pixel, frequency| # grab list of colors and frequency
        
        shade = ColorNamer.name_from_html_hash(
                  pixel.to_color(Magick::AllCompliance, false, 8, true)
                ).last # get shade of the color
        
        colors << shade
        
      end

      quantized.destroy! # prevent memory leaks
      colors.uniq!
    end


=======
  field :filename
  
  mount_uploader :file, Uploader
>>>>>>> 701834f098994796692ec4b9c7b90e3ec2d74e7c
end