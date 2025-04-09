import React from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import images from '@/img'; // Ensure this is imported correctly

type DaysComponentProps = {
  el: {
    background: string;
    user: string;
  };
  i: number;
};

const DaysComponents: React.FC<DaysComponentProps> = ({ el, i }) => {
  return (
    <div className="w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-custom">
      <div>
        <div className="rounded-lg overflow-hidden">
          <Image
            src={el.background}
            alt="hình nền hồ sơ"
            width={500}
            height={300}
            className='object-cover w-full h-64'
          />
        </div>

        <div className="grid grid-cols-3 gap-4 my-2">
          <Image
            src={images[`creatorbackground${i + 2}`]}
            alt="hồ sơ"
            width={200}
            height={200}
            layout='fixed'
            className="rounded-bl-lg object-cover w-full h-32"
          />
          <Image
            src={images[`creatorbackground${i + 4}`]}
            alt="hồ sơ"
            width={200}
            height={200}
            className="rounded-bl-lg object-cover w-full h-32"
          />
          <Image
            src={images[`creatorbackground${i + 3}`]}
            alt="hồ sơ"
            width={200}
            height={200}
            layout='fixed'
            className="rounded-bl-lg object-cover w-full h-32"
          />
        </div>

        <div className="px-4 py-4">
          <h2 className="text-lg font-bold">Bộ Sưu Tập Tuyệt Vời</h2>
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-4">
              <Image
                src={el.user}
                alt="hồ sơ"
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
              <p>
                Người Sáng Tạo
                <span className="font-semibold mx-2">
                  Người Dùng
                  <small className="inline-block">
                    <MdVerified />
                  </small>
                </span>
              </p>
            </div>

            <div>
              <small className="whitespace-nowrap font-semibold border-4 border-icons p-2 rounded-md">
                {i + 4}.255 ETH
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaysComponents;
