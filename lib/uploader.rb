class Uploader < CarrierWave::Uploader::Base

  include CarrierWave::MimeTypes
  include CarrierWave::RMagick

  process :set_content_type

  ##
  # Image manipulator library:
  #
  # include CarrierWave::RMagick
  # include CarrierWave::ImageScience
  # include CarrierWave::MiniMagick

  ##
  # Storage type
  #
  storage :file
  # configure do |config|
  #   config.fog_credentials = {
  #     :provider              => 'XXX',
  #     :aws_access_key_id     => 'YOUR_ACCESS_KEY',
  #     :aws_secret_access_key => 'YOUR_SECRET_KEY'
  #   }
  #   config.fog_directory = 'YOUR_BUCKET'
  # end
  # storage :fog



  ## Manually set root
  def root; File.join(Padrino.root,"public/"); end

  ##
  # Directory where uploaded files will be stored (default is /public/uploads)
  #
  def store_dir
    "uploads/#{model.name[0, 2].downcase}/#{model.id}"
  end

  ##
  # Directory where uploaded temp files will be stored (default is [root]/tmp)
  #
  def cache_dir
    Padrino.root("tmp")
  end


  ##
  # Default URL as a default if there hasn't been a file uploaded
  #
  # def default_url
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  ##
  # Process files as they are uploaded.
  #
  # process :resize_to_fit => [740, 580]

  ##
  # Create different versions of your uploaded files
  #
  # version :header do
  #   process :resize_to_fill => [940, 250]
  #   version :thumb do
  #     process :resize_to_fill => [230, 85]
  #   end
  # end
  ##
  # White list of extensions which are allowed to be uploaded:
  #
  def extension_white_list
    %w(jpg jpeg gif png avi mkv mp3 flac aac wav midi pdf doc docx xls xlsx ppt pptx rtf txt)
  end

  ##
  # Override the filename of the uploaded files
  #
  # def filename
  #   "something.jpg" if original_filename
  # end
  version :thumb, :if => :image? do
    process :resize_to_limit => [200, 200]
  end

  protected
    def image?(new_file)
      new_file.content_type.include? 'image'
    end
end
